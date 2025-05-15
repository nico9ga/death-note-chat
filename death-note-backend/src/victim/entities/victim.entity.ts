import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { VictimImage } from "./victim-image.entity";


@Entity()
export class Victim {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    lastName: string;

    @Column('text',{
        default:"Heart Attack"
    })
    deathType: string;

    @Column('text',{nullable: true})
    details: string;

    @Column('bool',{
        default:true,
    })
    isAlive:boolean;


    // @ApiProperty({
    //     example: "2024-02-21T15:30:00Z",
    //     description: "Fecha y hora en que se creó el tweet",
    //     type: String
    // })
    @CreateDateColumn({ type: 'timestamp', precision: 0 }) // el timestamp es para tiempo más exacto diferente a date
    createdAt: Date;

    // @ApiProperty({
    //     example: "2024-02-21T15:30:00Z",
    //     description: "Fecha y hora en que se edita el tweet",
    //     type: String
    // })
    @Column({ type: 'timestamp', precision: 0, nullable: true, default: null })
    EditedAt: Date | null;

    //agregar relacion con imagenes
    @OneToMany(
        () => VictimImage,
        (victimImage) => victimImage.victim,
        {cascade:true, eager:true}
    )
    images?: VictimImage[]; //Si fueran varias imagenes se cambia a: VictimImage[]; dando a entender que es un arreglo. (También cambias la relacion a OneToMany y en el otro lado a ManyToOne)



    @BeforeInsert()
    checkFullNameInsert(){
        this.name = this.name.toUpperCase()
        this.lastName = this.lastName.toUpperCase()
    }
}
