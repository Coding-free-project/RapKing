import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async sendMessage(dto: CreateContactDto) {
    const message = await this.prisma.contactMessage.create({ data: dto });

    try {
      const transporter = nodemailer.createTransport({
        host: this.config.get('SMTP_HOST'),
        port: parseInt(this.config.get('SMTP_PORT') || '587'),
        secure: false,
        auth: {
          user: this.config.get('SMTP_USER'),
          pass: this.config.get('SMTP_PASS'),
        },
      });

      await transporter.sendMail({
        from: `"RapKing Contact" <${this.config.get('SMTP_USER')}>`,
        to: this.config.get('CONTACT_EMAIL'),
        subject: `[Contact RapKing] ${dto.subject}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${dto.name}</p>
          <p><strong>Email :</strong> ${dto.email}</p>
          <p><strong>Sujet :</strong> ${dto.subject}</p>
          <p><strong>Message :</strong></p>
          <p>${dto.message.replace(/\n/g, '<br>')}</p>
        `,
      });

      await transporter.sendMail({
        from: `"RapKing" <${this.config.get('SMTP_USER')}>`,
        to: dto.email,
        subject: 'Votre message a bien été reçu — RapKing',
        html: `
          <h2>Merci pour votre message, ${dto.name} !</h2>
          <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
          <br>
          <p>L'équipe RapKing</p>
        `,
      });
    } catch (err) {
      console.error('Email send error:', err);
    }

    return { message: 'Message envoyé avec succès' };
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAsUnread(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: false },
    });
  }
}
