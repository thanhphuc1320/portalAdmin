import { RoutesTabType, ServiceType } from '../models/permission';
import Article from 'modules/social-admin/article/pages/Article';
import PinPage from 'modules/social-admin/pin/pages/Pin';
import Winner from 'modules/social-admin/activity/winner/pages/Winner';
import Reward from 'modules/social-admin/activity/reward/pages/Reward';
import CreateUpdateReward from 'modules/social-admin/activity/reward/pages/CreateUpdateReward';
import Event from 'modules/social-admin/activity/event/pages/Event';
import Item from 'modules/social-admin/item/pages/Item';
import CreateUpdateEvent from 'modules/social-admin/activity/event/pages/CreateUpdateEvent';
import CreateHashTag from 'modules/social-admin/hashtag/components/CreateHashTag';
import ViewHashTag from 'modules/social-admin/hashtag/components/ViewHashTag';
import Hashtag from 'modules/social-admin/hashtag/page/Hashtag';
import CreateHashTagRanking from 'modules/social-admin/hashtagRanking/components/CreateHashTagRanking';
import ViewHashTagRanking from 'modules/social-admin/hashtagRanking/components/ViewHashTagRanking';
import HashtagRanking from 'modules/social-admin/hashtagRanking/page/HashtagRanking';
import CreateUpdateArticle from 'modules/social-admin/article/pages/CreateUpdateArticle';
import FollowerYou from 'modules/social-admin/follower/page/FollowerYou';
import ManagerSources from 'modules/social-admin/manager-sources/pages/Sources';
import PostCrawler from 'modules/social-admin/manager-sources/pages/PostCrawler';
import Notifications from 'modules/social-admin/notification/page/Notifications';
import Censor from 'modules/social-admin/content-censorship/pages/CensorshipContainer';
import User from 'modules/social-admin/user/pages/UserContainer';
import DetailUser from 'modules/social-admin/user/pages/DetailUserContainer';
// import YouFollower from '../modules/social-admin/follower/page/YouFollower';

function buildRoutePath(moduleName: ServiceType, path: string) {
  return `/${moduleName}${path}`;
}

export const ROUTES = {
  login: '/login',
  article: {
    result: buildRoutePath('article', ''),
    create: buildRoutePath('article', '/create'),
    update: buildRoutePath('article', '/update'),
  },
  pin: {
    result: buildRoutePath('pin', ''),
    create: buildRoutePath('pin', '/create'),
    update: buildRoutePath('pin', '/update'),
  },
  item: {
    result: buildRoutePath('item', ''),
  },
  winner: {
    result: buildRoutePath('winner', ''),
  },
  reward: {
    result: buildRoutePath('reward', ''),
    create: buildRoutePath('reward', '/create'),
    update: buildRoutePath('reward', '/update'),
  },
  event: {
    result: buildRoutePath('event', ''),
    create: buildRoutePath('event', '/create'),
    update: buildRoutePath('event', '/update'),
  },
  hashtag: {
    result: buildRoutePath('hashtag', ''),
    create: buildRoutePath('hashtag', '/create'),
    update: buildRoutePath('hashtag', '/update'),
    view: buildRoutePath('hashtag', '/view'),
  },
  hashtagRanking: {
    result: buildRoutePath('hashtag-ranking', ''),
    create: buildRoutePath('hashtag-ranking', '/create'),
    update: buildRoutePath('hashtag-ranking', '/update'),
    view: buildRoutePath('hashtag-ranking', '/view'),
  },
  // youFollower: {
  //   result: buildRoutePath('management-follower', '/followering'),
  // },
  followerYou: {
    result: buildRoutePath('management-follower', '/followers'),
  },
  user: {
    result: buildRoutePath('user', ''),
    detail: buildRoutePath('user', '/detail'),
  },
  sourceManager: {
    result: buildRoutePath('sources', '/manager-sources'),
  },
  sourcePost: {
    result: buildRoutePath('sources', '/manager-post'),
  },
};

export const ROUTES_TAB: RoutesTabType[] = [
  {
    name: 'MANAGEMENT_ARTICLE',
    isModule: true,
    component: Article,
    exact: true,
    path: '/',
    subName: 'Tạo bài viết',
    hiddenMenu: [
      {
        path: ROUTES.article.create,
        name: 'CREATE_ARTICLE',
        isModule: false,
        component: CreateUpdateArticle,
      },
      {
        path: ROUTES.article.update,
        name: 'UPDATE_ARTICLE',
        isModule: false,
        component: CreateUpdateArticle,
      },
    ],
  },
  {
    path: ROUTES.pin.result,
    name: 'MANAGEMENT_PIN',
    isModule: true,
    component: PinPage,
  },
  {
    path: ROUTES.winner.result,
    name: 'MANAGEMENT_WINNER',
    isModule: true,
    component: Winner,
  },
  {
    path: ROUTES.reward.result,
    name: 'MANAGEMENT_REWARD',
    isModule: true,
    component: Reward,
    subName: 'Thêm giải thưởng',
    hiddenMenu: [
      {
        path: ROUTES.reward.create,
        name: 'CREATE_REWARD',
        isModule: false,
        component: CreateUpdateReward,
      },
      {
        path: ROUTES.reward.update,
        name: 'UPDATE_REWARD',
        isModule: false,
        component: CreateUpdateReward,
      },
    ],
  },
  {
    name: 'MANAGEMENT_EVENT',
    isModule: true,
    component: Event,
    exact: true,
    path: '/event',
    subName: 'Tạo sự kiện',
    hiddenMenu: [
      {
        path: ROUTES.event.create,
        name: 'CREATE_EVENT',
        isModule: false,
        component: CreateUpdateEvent,
      },
      {
        path: ROUTES.event.update,
        name: 'UPDATE_EVENT',
        isModule: false,
        component: CreateUpdateEvent,
      },
    ],
  },
  {
    name: 'MANAGEMENT_ITEM',
    isModule: true,
    component: Item,
    exact: true,
    path: '/item',
  },
  {
    name: 'MANAGEMENT_HASHTAG',
    isModule: true,
    component: Hashtag,
    exact: true,
    path: '/hashtag',
    subName: 'Tạo hashtag',
    hiddenMenu: [
      {
        path: ROUTES.hashtag.create,
        name: 'CREATE_HASHTAG',
        isModule: false,
        component: CreateHashTag,
      },
      {
        path: ROUTES.hashtag.update,
        name: 'UPDATE_HASHTAG',
        isModule: false,
        component: ViewHashTag,
      },
      {
        path: ROUTES.hashtag.view,
        name: 'VIEW_HASHTAG',
        isModule: false,
        component: ViewHashTag,
      },
    ],
  },
  {
    name: 'MANAGEMENT_HASHTAG_RANKING',
    isModule: true,
    component: HashtagRanking,
    exact: true,
    path: '/hashtag-ranking',
    subName: 'Tạo bảng xếp hạng',
    hiddenMenu: [
      {
        path: ROUTES.hashtagRanking.create,
        name: 'CREATE_HASHTAG_RANKING',
        isModule: false,
        component: CreateHashTagRanking,
      },
      {
        path: ROUTES.hashtagRanking.update,
        name: 'UPDATE_HASHTAG_RANKING',
        isModule: false,
        component: CreateHashTagRanking,
      },
      {
        path: ROUTES.hashtagRanking.view,
        name: 'VIEW_HASHTAG_RANKING',
        isModule: false,
        component: ViewHashTagRanking,
      },
    ],
  },
  {
    name: 'MANAGEMENT_FOLLOWER',
    isModule: true,
    component: FollowerYou,
    exact: true,
    path: '/follower',
    subMenu: [
      // {
      //   path: ROUTES.youFollower.result,
      //   name: 'YOUFOLLOWER',
      //   isModule: false,
      //   component: YouFollower,
      // },
      {
        path: ROUTES.followerYou.result,
        name: 'FOLLOWERYOU',
        isModule: false,
        component: FollowerYou,
      },
    ],
  },
  {
    name: 'SOURCES',
    isModule: true,
    component: ManagerSources,
    exact: true,
    path: '/sources',
    subMenu: [
      {
        path: ROUTES.sourceManager.result,
        name: 'MANAGEMENT_SOURCES',
        isModule: false,
        component: ManagerSources,
      },
      {
        path: ROUTES.sourcePost.result,
        name: 'MANAGEMENT_POSTS',
        isModule: false,
        component: PostCrawler,
      },
    ],
  },
  {
    name: 'MANAGEMENT_NOTIFICATION',
    isModule: true,
    component: Notifications,
    exact: true,
    path: '/notifications',
  },
  {
    name: 'MANAGEMENT_USER',
    isModule: true,
    component: User,
    exact: true,
    path: '/user',
    hiddenMenu: [
      {
        path: ROUTES.user.detail,
        name: 'DETAIL_USER',
        isModule: false,
        component: DetailUser,
      },
    ],
  },
  {
    name: 'MANAGEMENT_CENSOR',
    isModule: true,
    component: Censor,
    exact: true,
    path: '/censor',
  },
];
