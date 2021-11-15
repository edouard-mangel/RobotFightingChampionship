/* eslint-disable no-unused-vars */
export enum EntityId {
    playerA = 'playerAId',
    playerB = 'playerBId',
    playerATower = 'playerATowerId',
    playerBTower = 'playerBTowerId',
    playerARobot = 'playerARobotId',
    playerBRobot = 'playerBRobotId',
    grid = 'gridId',
    cellx1y1 = 'cellx1y1Id',
    cellx1y2 = 'cellx1y2Id',
    cellx2y1 = 'cellx2y1Id',
    cellx2y2 = 'cellx2y2Id',
    cellx9y9 = 'cellx9y9Id',
    cellx10y10 = 'cellx10y10Id',
    cellMissing = 'cellmissingId',
    victory = 'victoryId',
    defeat = 'defeatId',
    simpleMatchLobby = 'simpleMatchLobbyEntityId',
    match = 'matchId',
    game = 'gameEntityId',
    playerAPointer = 'playerAPointerId',
    playerAJoinSimpleMatchButton = 'playerAJoinMatchButtonId',
    playerEndTurnButton = 'playerEndTurnButtonId',
    playerAMainMenu = 'playerAMainMenu',
    playerBMainMenu = 'playerBMainMenu'
}
export const players = ['playerAId', 'playerBId', 'playerCId', 'playerDId', 'playerEId', 'playerFId', 'playerGId', 'playerHId']
export const simpleMatchButtons = ['playerAJoinMatchButtonId', 'playerBJoinMatchButtonId', 'playerCJoinMatchButtonId', 'playerDJoinMatchButtonId', 'playerEJoinMatchButtonId', 'playerFJoinMatchButtonId', 'playerGJoinMatchButtonId', 'playerHJoinMatchButtonId']
export const mainMenus = ['playerAMainMenuId', 'playerBMainMenuId', 'playerCMainMenuId', 'playerDMainMenuId', 'playerEMainMenuId', 'playerFMainMenuId', 'playerGMainMenuId', 'playerHMainMenuId']
export const expectedAddedPlayers = ['playerAId', 'playerBId']
export const expectedStillWaitingPlayers = ['playerCId', 'playerDId']
