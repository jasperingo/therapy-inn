
import { articlestate } from "./AppContext";
import { ArticleAction, ArticleActionTypes, ArticleStateType } from "./AppContextType";

const ArticleReducer = (state: ArticleStateType, { type, payload }: ArticleAction): ArticleStateType => {

  switch(type) {

    case ArticleActionTypes.UNFETCHED:
      return { ...articlestate, loading: true, page: 0 };

    case ArticleActionTypes.FETCHED:
      if (payload !== undefined && 'loading' in payload) {
        
        const list = payload.list !== undefined ? payload.list : [];

        return {
          list: [... state.list, ...list],
          ended: payload.ended ?? state.ended,
          error: payload.error ?? state.error,
          loading: payload.loading ?? state.loading,
          page: payload.page ?? state.page,
          refreshing: payload.refreshing ?? state.refreshing
        };

      } else {
        return state;
      }
    
    case ArticleActionTypes.CREATED:
      if (payload !== undefined && payload.article !== undefined && state.page > -1) {
        return {
          ...state,
          page: state.page > 0 ? state.page : payload.article.creatdAt,
          list: [payload.article, ...state.list]
        };
      } else {
        return state;
      }

    case ArticleActionTypes.DELETED:
        return {
          ...state,
          list: state.list.filter(i=> i.id !== payload?.article?.id ?? '')
        };
      

    default:
      return state;
  }
}

export default ArticleReducer;
