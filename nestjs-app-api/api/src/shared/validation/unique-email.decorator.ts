import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Repository } from "typeorm";
import { User } from "../../modules/users/domain/entities/user.entity";

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async validate(email: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    // If updating a user, exclude the current user from the uniqueness check
    if (relatedValue) {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      return !user || user.id === relatedValue;
    }

    // For new users, check if email already exists
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return "Email already exists";
  }
}

export function IsEmailUnique(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsEmailUniqueConstraint,
    });
  };
}
