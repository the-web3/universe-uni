function isVaild(value){
    return this?.pattern?.test(value?.trim());
}
export const rules = {
    password: {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z\d]{8,}/,
        message: '不少于8位,至少包含1个字母和一个数字',
        isVaild
    }
}