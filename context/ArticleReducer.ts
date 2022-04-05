
import { articlestate } from "./AppContext";
import { ArticleAction, ArticleActionTypes, ArticleStateType } from "./AppContextType";

const ArticleReducer = (state: ArticleStateType, { type, payload }: ArticleAction): ArticleStateType => {

  switch(type) {

    case ArticleActionTypes.UNFETCHED:
      return { ...articlestate, refreshing: true };

    case ArticleActionTypes.FETCHED:
      if (payload !== undefined) {
        
        const list = payload.list !== undefined ? payload.list : [];

        return {
          list: [... state.list, ...list],
          loading: payload.loading ?? state.loading,
          loaded: payload.loaded ?? state.loaded,
          refreshing: payload.refreshing ?? state.refreshing,
          error: payload.error !== undefined ? payload.error : state.error,
        };

      } else {
        return state;
      }
    
    case ArticleActionTypes.CREATED:
      if (payload !== undefined && payload.article !== undefined) {
        return {
          ...state,
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
