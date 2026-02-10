import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(userData: Partial<User>) {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find({
      select: [
        'id',
        'email',
        'nickname',
        'avatar_url',
        'role',
        'crypto_wallet_address',
        'crypto_qr_code_url',
        'created_at',
      ],
    });
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email: email.toLowerCase() } });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async update(id: number, updateData: Partial<User>) {
    // Prevent role escalation - remove role from update data
    delete updateData.role;
    // Prevent password_hash from being set directly
    delete updateData.password_hash;

    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }
}
