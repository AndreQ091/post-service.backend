import { JwtGuard } from './jwt.guard';
import { GqlGuard } from './gql.guard';

export const GUARDS = [JwtGuard, GqlGuard];
