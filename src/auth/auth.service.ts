import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';

import * as bcryptjs from 'bcryptjs';

import { User } from './entities/user.entity';
import {Model} from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto } from './dto/register-user.dto';
import { retry } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService
  ){
  }

  async create(createUserDto: CreateUserDto): Promise <User>{

    try {

      //! Encriptar password
      const {password, ...userData} = createUserDto;

      const newUser = new  this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

    //* Guardar usuario
      await newUser.save(); 
      //el guion bajo es para renombrar el password ya puesta
      const {password:_, ...user} = newUser.toJSON();

      return user;

    } catch (error) {
      if(error.code === 11000){
        throw new BadRequestException(`${createUserDto.email} already exists`)
      }

      throw new InternalServerErrorException('Something went wrong');
    }

    //* Generar JWT
  }

  async register(registerUserDto:RegisterUserDto):Promise<LoginResponse>{

    const userCreated = await this.create(registerUserDto);

    return {
      user: userCreated,
      token: this.getJwtToken({id: userCreated._id})
    }

  }

  async login(loginDto:LoginDto):Promise<LoginResponse>{
    
    const {email, password} = loginDto;

    const user = await this.userModel.findOne({email})

    if(!user){
      throw new UnauthorizedException('Not valid credentials - email')
    }

    if(!bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Not valid credentials - password')
    }

    const {password:_, ...rest} = user.toJSON()

    return{
      user: rest,
      //* generar token pendiente
      token:this.getJwtToken({id: user.id}),
    }
  }

  // async checkToken(token:string):Promise<LoginResponse>{

  // }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async findUserById(id:string){
    const user = await this.userModel.findById(id);

    const {password, ...rest} = user.toJSON();

    return rest;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

}
