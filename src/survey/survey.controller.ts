import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { Response } from 'express';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { SubmitResponseDto } from './dto/fill-survey.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Surveys')
@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @ApiOperation({
    summary: 'Realiza a criação da estrutura de um formulario em especifico',
    description:
      'Este endpoint tem como objetivo gravar a estrutura de um formulario em especifico',
  })
  @ApiResponse({
    status: '2XX',
    description: 'Um exemplo de como seria o rertono com sucesso',
    example: {
      title: 'Pesquisa de Satisfação 3',
      questions: [
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
          question: 'Pergunta Teste',
          type: 'text',
        },
      ],
      updated_at: null,
      _id: '66a54f782a3194cb9560a43c',
      created_at: '2024-07-27T19:50:16.270Z',
    },
  })
  @Post()
  async create(
    @Body() createSurveyDto: CreateSurveyDto,
    @Res() response: Response,
  ) {
    try {
      const returnCreatedSurvey = await this.surveyService.create(
        createSurveyDto,
      );

      return response.status(201).send(returnCreatedSurvey);
    } catch (err) {
      if (err.message === 'Survey already exists') {
        return response
          .status(406)
          .send({ message: err.message, statusCode: 406 });
      }

      return response
        .status(400)
        .send({ message: err.message, statusCode: 400 });
    }
  }

  @ApiOperation({
    summary: 'Realiza a alteração em uma estrutura de formulario já criada',
    description:
      'Este endpoint tem como objetivo realizar modificações em uma estrutura de formulario já criada anteriormente',
  })
  @ApiParam({
    description: 'uuid que é gerado automaticamente ao gravar o formulario',
    example: '66a51706238556d09b47fb72',
    name: 'id',
  })
  @ApiResponse({
    status: '2XX',
    description:
      'Um exemplo de como seria o rertono com sucesso, após ter sido atualizado',
    example: {
      title: 'Pesquisa de Satisfação 3',
      questions: [
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
          question: 'Pergunta Teste',
          type: 'text',
        },
      ],
      updated_at: '2024-07-28T20:57:16.270Z',
      _id: '66a54f782a3194cb9560a43c',
      created_at: '2024-07-27T19:50:16.270Z',
    },
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSurveyDto: UpdateSurveyDto,
    @Res() response: Response,
  ) {
    try {
      const surveyUpdated = await this.surveyService.update(
        id,
        updateSurveyDto,
      );

      return response.status(200).send(surveyUpdated);
    } catch (err) {
      return response
        .status(400)
        .send({ message: err.message, statusCode: 400 });
    }
  }

  @ApiOperation({
    summary:
      'Realizar a criação das respostas em relação a um formulario já existente',
    description:
      'Este endpoint tem como objetivo realizar a criação das respostas em relação a um formulario já existente',
  })
  @ApiResponse({
    status: '2XX',
    description:
      'Um exemplo de como seria o rertono com sucesso, após ter sido registrado as respostas',
    example: {
      survey: '66a51706238556d09b47fb72',
      responses: [
        {
          question: 'Público-alvo',
          answer: 'Teste',
        },
        {
          question: 'Quantidade de estrelas',
          answer: '5',
        },
        {
          question: 'e-mail para contato',
          answer: 'user@example.com',
        },
      ],
      _id: '66a56b2fbac77dd39e6dd7b5',
      created_at: '2024-07-27T21:48:31.427Z',
    },
  })
  @Post('/fill')
  async fillSurvey(
    @Body() submitResponseDto: SubmitResponseDto,
    @Res() response: Response,
  ) {
    try {
      const fillCreated = await this.surveyService.submitResponse(
        submitResponseDto,
      );

      return response.status(201).send(fillCreated);
    } catch (err) {
      if (err.message === 'Survey not found') {
        return response
          .status(404)
          .send({ message: err.message, statusCode: 404 });
      }

      return response
        .status(400)
        .send({ message: err.message, statusCode: 400 });
    }
  }

  @ApiParam({
    name: 'sort',
    description:
      'Informar como deseja que a pesquisa sejam retornado em relação a quantidade de estrelas para cada resposta, aceitando "asc" e "desc"',
    example: 'asc',
  })
  @ApiParam({
    name: 'audience',
    description:
      'Informar o público alvo que deseja obter as respostas e respostas em especifico',
    example: 'Geeks',
  })
  @ApiOperation({
    summary:
      'Realizar a listagem dos preenchimentos das respostas pelo Público-alvo',
    description:
      'Esse endpoint tem como objetivo listar os preenchimentos pelo Público-alvo, também sendo possivel escolher qual a ordem em relação a quantidade de estrelas conforme cada preeenchimento de resposta',
  })
  @ApiResponse({
    status: '2XX',
    description:
      'Um exemplo de como seria o rertono com sucesso, com o público alvo sendo "Teste" e em ordem crescente',
    example: [
      {
        _id: '66a52b5ab054f518a180c508',
        survey: '66a5250249f57cb1ce34e1bf',
        responses: [
          {
            question: 'Público-alvo',
            answer: 'Teste',
          },
          {
            question: 'Quantidade de estrelas',
            answer: '5',
          },
          {
            question: 'e-mail para contato',
            answer: 'user@example.com',
          },
          {
            question: 'Pergunta Teste',
            answer: 'TESTADO',
          },
        ],
        created_at: '2024-07-27T17:16:10.549Z',
      },
      {
        _id: '66a56b2fbac77dd39e6dd7b5',
        survey: '66a51706238556d09b47fb72',
        responses: [
          {
            question: 'Público-alvo',
            answer: 'Teste',
          },
          {
            question: 'Quantidade de estrelas',
            answer: '5',
          },
          {
            question: 'e-mail para contato',
            answer: 'user@example.com',
          },
        ],
        created_at: '2024-07-27T21:48:31.427Z',
      },
    ],
  })
  @Get('responses')
  async findResponsesByAudience(
    @Query('audience') audience: string,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Res() response: Response,
  ) {
    try {
      const returnByAudience = await this.surveyService.listResponsesByAudience(
        audience,
        sort,
      );

      return response.status(200).send(returnByAudience);
    } catch (err) {
      return response
        .status(400)
        .send({ message: err.message, statusCode: 400 });
    }
  }
}
