let sessionInfo = new Map();


export function getMap(id:string):string{
    return sessionInfo.get(id);
}

export function setMap(id:string,sessionKey:string):void{
    sessionInfo.set(id,sessionKey);
}

