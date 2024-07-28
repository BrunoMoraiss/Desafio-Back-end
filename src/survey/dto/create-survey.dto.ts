import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from './enum/create-survey.enum.dto';
import { ValidateQuestions } from 'src/helpers/validators/validate-questions';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;
}

export class CreateSurveyDto {
  @ApiProperty({
    description:
      'Titulo que será utilizado para criar a pesquisa de satisfação',
    example: 'Pesquisa de satisfação',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description:
      'Descrição opicional caso necessario, com intuito de fornecer mais informações sobre o formulario especifico',
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
    required: true,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @Validate(ValidateQuestions)
  questions: QuestionDto[];
}
