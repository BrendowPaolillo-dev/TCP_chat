export default {
    setUserName(userName = ' ') {
        localStorage.setItem('userName', JSON.stringify(userName));
    },

    getUserName() {
        return JSON.parse(localStorage.getItem('userName') ?? '{}');
    },
}