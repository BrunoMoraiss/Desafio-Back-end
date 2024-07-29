import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Survey,
  Response as ResponseSurvey,
} from '../infra/database/schema/survey/survey.schema';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { SubmitResponseDto } from './dto/fill-survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
    @InjectModel(ResponseSurvey.name)
    private responseModel: Model<ResponseSurvey>,
  ) {}

  async create(createSurveyDto: CreateSurveyDto): Promise<Survey> {
    try {
      const verifySurveyExist = await this.surveyModel.findOne({
        title: createSurveyDto.title,
      });

      if (verifySurveyExist) {
        throw new Error('Survey already exists');
      }

      const createdSurvey = await this.surveyModel.create(createSurveyDto);
      return createdSurvey;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async update(id: string, updateSurveyDto: UpdateSurveyDto): Promise<Survey> {
    try {
      const verifyId = await this.surveyModel.findById(id);

      if (!verifyId) {
        throw new Error('object not found');
      }

      return this.surveyModel.findByIdAndUpdate(
        id,
        {
          updated_at: Date.now(),
          ...updateSurveyDto,
        },
        { new: true },
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async submitResponse(submitResponseDto: SubmitResponseDto) {
    const { survey: surveyId, responses } = submitResponseDto;

    const survey = await this.surveyModel.findById(surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }

    const questionMap = new Map(survey.questions.map((q) => [q.question, q]));

    for (const response of responses) {
      const question = questionMap.get(response.question);
      if (!question) {
        throw new Error(`Question not found: ${response.question}`);
      }
    }

    const response = await this.responseModel.create({
      survey: surveyId,
      responses,
    });
    return response;
  }

  async listResponsesByAudience(
    audience: string,
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const responses = await this.responseModel.aggregate([
      { $match: { 'responses.answer': audience } },
      {
        $addFields: {
          stars: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$responses',
                  as: 'response',
                  cond: {
                    $eq: ['$$response.question', 'Quantidade de estrelas'],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $sort: {
          'stars.answer': sortOrder === 'asc' ? 1 : -1, // 'asc' para crescente, 'desc' para decrescente
        },
      },
      {
        $project: {
          stars: 0,
        },
      },
    ]);

    return responses;
  }
}
