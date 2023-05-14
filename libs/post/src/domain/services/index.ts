import { ISetNotPublished, SET_NOT_PUBLISHED } from './set-not-published.case';
import { AggregateRoot } from '@nestjs/cqrs';
import { ISetPublished, SET_PUBLISHED } from './set-published.case';
import { IPlainToInstance, PLAIN_TO_INSTANCE } from './plain-to-instance.case';

export class PostServices
  extends AggregateRoot
  implements ISetNotPublished, ISetPublished, IPlainToInstance
{
  setNotPublished = SET_NOT_PUBLISHED;
  setPublished = SET_PUBLISHED;
  plainToInstance = PLAIN_TO_INSTANCE;
}
