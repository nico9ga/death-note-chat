import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Victim } from "./victim.entity";

@Entity()
export class VictimImage{

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        ()=> Victim,
        (victim) => victim.images,
        {onDelete:'CASCADE'}
    )
    //@JoinColumn() //CUANDO HAY RELACIONES ONE TO ONE, NECESITAMOS COLOCAR ESTO PARA QUE LA TABLA QUE NECESITE EL ID LO PONGA COMO UNA COLUMNA
    victim: Victim;
}