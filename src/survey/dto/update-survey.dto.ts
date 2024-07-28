import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionDto } from './create-survey.dto'; // Ajuste o caminho conforme necessário
import { ValidateQuestions } from 'src/helpers/validators/validate-questions';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSurveyDto {
  @ApiProperty({
    description: 'Titulo que será utilizado como identificação ao formulario',
    example: 'Pesquisa de satisfação para público infantil',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description:
      'Descrição que será utilizado ao formulario, caso haja necessidade',
    example:
      'Pesquisa de satisfação com intuito de verificar quais as novidades que desejamos implementar na nossa loja',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description:
      'Perguntas que serão utilizadas no formulario, também especificar o type com objetivo de facilitar quando o formulario for consumido em algum lugar',
    example: [
      {
        question: 'Público-alvo',
        type: 'text',
      },
      {
        question: 'Quantidade de estrelas',
        type: 'rating',
      },
      {
        question: 'e-mail para contato',
        type: 'email',
      },
      {
        question: 'Novidades que gostaria de ver em nosso e-commerce',
        type: 'text',
      },
    ],
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @Validate(ValidateQuestions)
  questions?: QuestionDto[];
}
