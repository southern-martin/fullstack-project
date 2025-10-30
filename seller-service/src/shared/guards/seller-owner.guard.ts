import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { SellerService } from '../../domain/services/seller.service';

/**
 * Seller Owner Guard
 * Ensures the authenticated user is the owner of the seller account
 * or is an admin
 */
@Injectable()
export class SellerOwnerGuard implements CanActivate {
  constructor(private readonly sellerService: SellerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const sellerId = parseInt(request.params.id, 10);

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admins can access any seller account
    if (user.roles?.includes('admin')) {
      return true;
    }

    // Check if seller exists
    let seller;
    try {
      seller = await this.sellerService.getSellerById(sellerId);
    } catch (error) {
      throw new NotFoundException(`Seller with id ${sellerId} not found`);
    }

    // Check if user is the seller owner
    if (seller.userId !== user.id) {
      throw new ForbiddenException('You can only access your own seller account');
    }

    return true;
  }
}
