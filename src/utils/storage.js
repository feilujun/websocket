import { storage } from "quant-ui";


/***设置登陆状态 start */
const USERSTATE = "quant-userState"
export function setUserStatu() {
    storage.set(USERSTATE, "admin")
}
export function getLoginStatu() {
    return storage.get(USERSTATE, "guest") === "admin"
}
export function removeUserStatu() {
    return storage.remove(USERSTATE)
}
/***设置登陆状态 end */