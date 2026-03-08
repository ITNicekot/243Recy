import { Controller, Post, Get, Body, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  create(@Body() dto: CreateAlertDto, @Req() req) {
    const phone = req.user.phone_number; // Récupérer le numéro de téléphone depuis le token Firebase
  // Pour l'instant, on ignore isAquatic et waterType, à ajouter si besoin
  return this.alertsService.create(req.user.uid, dto, undefined, undefined, phone);
 }
  
  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  getMyAlerts(@Req() req) {
    return this.alertsService.findByUser(req.user.uid);
  }

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id/validate')
  validate(@Param('id') id: string) {
    return this.alertsService.validateAlert(id);
  }
}