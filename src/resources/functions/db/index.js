import * as activeUsers from './main/db-active-users';
import * as counters from './main/db-counters';
import * as exchangeRates from './main/db-exchange-rates';
import * as gameReports from './main/db-game-reports';
import * as gameTokens from './main/db-game-tokens';
// import * as gameTypeOptions from './db-game-type-options';
import * as playerBets from './main/db-player-bets';
import * as playerSessions from './main/db-player-sessions';
import * as sessions from './main/db-sessions';
import * as tableChips from './main/db-table-chips';
// import * as tableLimitRelations from './db-table-limit-relations';
import * as tableLimits from './main/db-table-limits';
import * as tables from './main/db-tables';
import * as userDatas from './main/db-user-datas';
import * as playerLogs from './main/db-player-logs';

import * as gameReportHistories from './history/db-game-report-histories';
import * as playerBetHistory from './history/db-player-bet-histories';

import * as users from './centralpoint/db-users';
import * as userLivecasinos from './centralpoint/db-user-livecasinos';


export default {
  activeUsers,
  counters,
  exchangeRates,
  gameReportHistories,
  gameReports,
  gameTokens,
  // gameTypeOptions,
  playerBetHistory,
  playerBets,
  playerSessions,
  sessions,
  tableChips,
  // tableLimitRelations,
  tableLimits,
  tables,
  userDatas,
  users,
  userLivecasinos,
  playerLogs,
};

