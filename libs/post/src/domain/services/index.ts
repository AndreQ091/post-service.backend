import { ISetNotPublished, SET_NOT_PUBLISHED } from './set-not-published.case';
import { AggregateRoot } from '@nestjs/cqrs';
import { ISetPublished, SET_PUBLISHED } from './set-published.case';

export class PostServices
  extends AggregateRoot
  implements ISetNotPublished, ISetPublished
{
  setNotPublished = SET_NOT_PUBLISHED;
  setPublished = SET_PUBLISHED;
}
