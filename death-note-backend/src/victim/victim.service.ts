import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateVictimDto } from './dto/create-victim.dto';
import { UpdateDeathTypeDto } from './dto/update-death-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Victim } from './entities/victim.entity';
import { Repository, UpdateDescription } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { VictimImage } from './entities/victim-image.entity';
import { isUUID } from 'class-validator';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class VictimService {
  private readonly logger = new Logger('VictimService')
  constructor(
    @InjectRepository(Victim)
    private readonly victimRepository: Repository<Victim>,

    @InjectRepository(VictimImage)
    private readonly victimImageRepository: Repository<VictimImage>,

  ){}
  
  async create(createVictimDto: CreateVictimDto) {
    try {
      const{images= [], ...victimDetails} = createVictimDto
      const victim = this.victimRepository.create({
        ...victimDetails,
        images: images.map(image => this.victimImageRepository.create({url:image})),
      });
      await this.victimRepository.save(victim);
      return {...victim, images};


    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  @Cron('*/10 * * * * *', { name: 'miCronJobCada10Segundos' })
  async findAllCron() {
    const pagination = { limit: 100, offset: 0 };
    const list = await this.findAll(pagination);
    const currentTime = new Date();
  
    for (const victim of list) {
      if (!victim.isAlive || victim.images.length === 0) continue;
  
      const referenceTime = victim.EditedAt || victim.createdAt;
      const difference = currentTime.getTime() - referenceTime.getTime();
  
      // Caso 1: Muerte por ataque cardiaco (40 segundos)
      if (victim.deathType === 'Heart Attack' && difference >= 40 * 1000) {
        await this.markAsDead(victim.id);
        continue;
      }
  
      // Caso 2: Con detalles específicos (40 segundos después de agregar detalles)
      if (victim.details && difference >= 40 * 1000) {
        await this.markAsDead(victim.id);
        continue;
      }
  
      // Caso 3: Sin detalles (6m40s = 400 segundos totales desde creación)
      if (!victim.details && difference >= 400 * 1000) {
        await this.markAsDead(victim.id);
      }
    }
  }
  
  private async markAsDead(id: string) {
    await this.victimRepository.update(id, { 
      isAlive: false,
      EditedAt: new Date() 
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 20, offset = 0 } = paginationDto;
    const products = await this.victimRepository.find({
      take:limit,
      skip: offset,
      relations: {
        images:true,
      }
    })
    // console.log(products.map(product=>({...product,images: product.images.map(img=> img.url)})))
    return products.map(product=>({
      ...product,
      images: product.images.map(img=> img.url)
    }))
  }

  async findOne(term: string) {

    let victim: Victim;

    if(isUUID(term)){
      victim = await this.victimRepository.findOneBy({id:term})
    } else{
      const queryBuilder = this.victimRepository.createQueryBuilder('prod');
      victim = await queryBuilder
      .where(`title ILIKE :term OR slug =:term`, {
        lastName:term.toUpperCase(),
        name:term.toUpperCase(),
      })
      .leftJoinAndSelect('prod.images','prodImages')
      .getOne();
    }

        if (!victim) 
          throw new NotFoundException(`Victim with ${term} not found`)
        return victim;
  }

  async findOnePlain( term: string){
    const {images = [], ...rest } = await this.findOne(term);
    return{
      ...rest,
      images: images.map(image => image.url)
    }
  }

  async updateDeathType(id: string, updateDeathTypeDto: UpdateDeathTypeDto) {

    const currentTimestamp: Date = new Date();
    const offset = 5; // Diferencia de +5 horas entre el sistema y PostgreSQL
    currentTimestamp.setHours(currentTimestamp.getHours() + offset);

    const victim = await this.victimRepository.preload({
      id: id,
      EditedAt: currentTimestamp,
      ...updateDeathTypeDto,
    });

    if(!victim) throw new NotFoundException(`Victim with id ${id} not found`);
    try {
      await this.victimRepository.save(victim);
      return this.findOnePlain(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al editar DeathType')
    }
  }

  async updateDeathDetails(id: string, updateDescription: UpdateDescription) {
    const victim = await this.victimRepository.preload({
      id,
      ...updateDescription,
      EditedAt: new Date() // Asegurar que se actualiza el timestamp
    });
  
    if (!victim) throw new NotFoundException(`Victim with id ${id} not found`);
    
    try {
      await this.victimRepository.save(victim);
      return this.findOnePlain(id);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) { //! EL REMOVE SE PUEDE HACER TAMBIEN CON TRANSACCIONES, REVISAR EL CAPITULO 149.Transacciones cualquier duda
    const victim = await this.findOne(id);
    await this.victimRepository.remove(victim);
  }


  private handleDBExceptions(error:any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    //console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
  
  async deleteAllVictims(){
    const query= this.victimRepository.createQueryBuilder('victim');

    try {
      return await query
      .delete()
      .where({})
      .execute();
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
