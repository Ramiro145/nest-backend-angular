import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto} from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';


@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.create(CreateUserDto);
  }


  @Post('/login')
  login(@Body() loginDto:LoginDto){
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerUserDto:RegisterUserDto){
    return this.authService.register(registerUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll( @Request() req: Request) {
    // const user = req['user'];
    console.log(req)
    return this.authService.findAll();
  }

  //verificar al usuario entre rutas en el front
  //con el guard indicamos que se devuelve en la request
  @UseGuards(AuthGuard)
  @Get('check-token')
   checkToken(@Request() req: Request): LoginResponse{

    const user = req['user'] as User;

    //es necesario devolver un token nuevo para tener nuevo tiempo de ingreso a la app
    // y estar verificando constantemente al usuario 
    return {
      user,
      token: this.authService.getJwtToken({id:user._id})
    }

  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
