import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ResponseDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  answer: string | number;
}

export class SubmitResponseDto {
  @ApiProperty({
    description:
      'Uuid que pertence ao esqueleto do formulario, para que as respostas sejam vinculadas corretamente ao formulario correto',
    example: '66a51706238556d09b47fb72',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  survey: string;

  @ApiProperty({
    description:
      'Perguntas que foram utilizadas no esquelto do formulario e as suas respectivas respostas',
    example: [
      { question: 'Público-alvo', answer: 'Teste' },
      { question: 'Quantidade de estrelas', answer: 5 },
      { question: 'e-mail para contato', answer: 'user@example.com' },
      {
        question: 'Novidades que gostaria de ver em nosso e-commerce',
        answer: 'Poderia ter maior diversidade de cores e estampas',
      },
    ],
    required: true,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseDto)
  responses: ResponseDto[];
}
