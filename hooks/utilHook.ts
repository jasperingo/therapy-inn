import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useRenderListFooter = ()=> {

  return (values: { canRender: boolean, render: ()=> JSX.Element }[])=> {
    for(const v of values) {
      if (v.canRender) {
        return v.render();
      }
    }
  }
}


export const useNetworkDetect = ()=> {

  const [connected, setConnected] = useState(false);

  useEffect(
    ()=> {
      return NetInfo.addEventListener((state)=> {
        setConnected(state.isConnected ?? false);
      });
    },
    []
  );

  return connected;
}
