import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy'; 
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'meu-super-poder', 
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersService], 
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}