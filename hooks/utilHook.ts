
export const useRenderListFooter = ()=> {

  return (values: { canRender: boolean, render: ()=> JSX.Element }[])=> {
    for(const v of values) {
      if (v.canRender) {
        return v.render();
      }
    }
  }
}
