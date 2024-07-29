import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Survey,
  Response as ResponseSurvey,
} from '../infra/database/schema/survey/survey.schema';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { QuestionType } from './dto/enum/create-survey.enum.dto';

describe('SurveyService - create', () => {
  let service: SurveyService;
  let surveyModel: Model<Survey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getModelToken(Survey.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(ResponseSurvey.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    surveyModel = module.get(getModelToken('Survey'));
  });

  it('should create a survey successfully', async () => {
    const createSurveyDto: CreateSurveyDto = {
      title: 'New Survey',
      questions: [
        {
          question: 'Público-alvo',
          type: QuestionType.Text,
        },
        {
          question: 'Quantidade de estrelas',
          type: QuestionType.Rating,
        },
        {
          question: 'e-mail para contato',
          type: QuestionType.Email,
        },
      ],
    };

    (surveyModel.findOne as jest.Mock).mockResolvedValue(null);
    (surveyModel.create as jest.Mock).mockResolvedValue(createSurveyDto);

    const result = await service.create(createSurveyDto);

    expect(result).toEqual(createSurveyDto);
  });

  it('should throw an error if survey already exists', async () => {
    const createSurveyDto = { title: 'Existing Survey', questions: [] };

    (surveyModel.findOne as jest.Mock).mockResolvedValue(createSurveyDto);

    await expect(service.create(createSurveyDto)).rejects.toThrow(
      'Survey already exists',
    );
  });
});

describe('SurveyService - update', () => {
  let service: SurveyService;
  let surveyModel: Model<Survey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getModelToken(Survey.name),
          useValue: {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(ResponseSurvey.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    surveyModel = module.get(getModelToken('Survey'));
  });

  it('should update a survey successfully', async () => {
    const id = '1';
    const updateSurveyDto = { title: 'Updated Survey' };

    (surveyModel.findById as jest.Mock).mockReturnValue({});
    (surveyModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...updateSurveyDto,
      updated_at: Date.now(),
    });

    const result = await service.update(id, updateSurveyDto);
    expect(result.title).toEqual('Updated Survey');
  });

  it('should throw an error if survey not found', async () => {
    const id = '1';
    const updateSurveyDto = { title: 'Updated Survey' };

    (surveyModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(service.update(id, updateSurveyDto)).rejects.toThrow(
      'object not found',
    );
  });
});

describe('SurveyService - submitResponse', () => {
  let service: SurveyService;
  let surveyModel: Model<Survey>;
  let responseModel: Model<ResponseSurvey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getModelToken(Survey.name),
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: getModelToken(ResponseSurvey.name),
          useValue: {
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    surveyModel = module.get(getModelToken('Survey'));
    responseModel = module.get(getModelToken('Response'));
  });

  it('should submit a response successfully', async () => {
    const submitResponseDto = {
      survey: '1',
      responses: [{ question: 'Q1', answer: 'A1' }],
    };

    const surveyMock = {
      _id: '1',
      questions: [{ question: 'Q1' }],
    };

    (surveyModel.findById as jest.Mock).mockResolvedValue(surveyMock);
    (responseModel.create as jest.Mock).mockResolvedValue(submitResponseDto);

    const result = await service.submitResponse(submitResponseDto);
    expect(result).toEqual(submitResponseDto);
  });

  it('should throw an error if survey not found', async () => {
    const submitResponseDto = {
      survey: '1',
      responses: [{ question: 'Q1', answer: 'A1' }],
    };

    (surveyModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(service.submitResponse(submitResponseDto)).rejects.toThrow(
      'Survey not found',
    );
  });

  it('should throw an error if question not found', async () => {
    const submitResponseDto = {
      survey: '1',
      responses: [{ question: 'Q2', answer: 'A1' }],
    };

    const surveyMock = {
      _id: '1',
      questions: [{ question: 'Q1' }],
    };

    (surveyModel.findById as jest.Mock).mockResolvedValue(surveyMock);

    await expect(service.submitResponse(submitResponseDto)).rejects.toThrow(
      'Question not found: Q2',
    );
  });
});

describe('SurveyService - listResponsesByAudience', () => {
  let service: SurveyService;
  let responseModel: Model<ResponseSurvey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getModelToken(Survey.name),
          useValue: {},
        },
        {
          provide: getModelToken(ResponseSurvey.name),
          useValue: {
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    responseModel = module.get(getModelToken('Response'));
  });

  it('should list responses by audience successfully', async () => {
    const audience = 'general';
    const responsesMock = [
      { responses: [{ question: 'Quantidade de estrelas', answer: 5 }] },
    ];

    (responseModel.aggregate as jest.Mock).mockResolvedValue(responsesMock);

    const result = await service.listResponsesByAudience(audience);
    expect(result).toEqual(responsesMock);
  });
});
