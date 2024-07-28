import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { QuestionDto } from '../../survey/dto/create-survey.dto';

@ValidatorConstraint({ name: 'validateQuestions', async: false })
export class ValidateQuestions implements ValidatorConstraintInterface {
  validate(questions: QuestionDto[]): boolean {
    if (!Array.isArray(questions)) return false;

    const requiredQuestions = [
      { question: 'Público-alvo', type: 'text' },
      { question: 'Quantidade de estrelas', type: 'rating' },
      { question: 'e-mail para contato', type: 'email' },
    ];

    return requiredQuestions.every((req) =>
      questions.some((q) => q.question === req.question && q.type === req.type),
    );
  }

  defaultMessage(): string {
    return 'O array de questões deve conter pelo menos os três itens obrigatórios: Público-alvo, Quantidade de estrelas, e-mail para contato';
  }
}
