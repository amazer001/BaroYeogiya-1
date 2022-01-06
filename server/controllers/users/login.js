const { v4 } = require('uuid');
const { user } = require('../../models');
const { generate, hash, refresh } = require('../../utils/token');

/**
 * @path /user/login
 */
module.exports = {
    /**
     * 로그인 API
     * @method GET
     * @param { id, pw } req.query
     */
    get: (req, res) => {
        const { id, pw } = req.query;
        let message = '';
        let data = {};

        // parameter 유무 확인
        if (id === undefined || pw === undefined) {
            message = 'Check your parameter.';
            
            res.status(400).send({ message });
        // 회원정보 확인 후 access token, refresh token 생성
        } else {
            user.findOne({
                where: {
                    user_id: id,
                    pw
                }
            }).then(result => {
                // 아이디 혹은 비밀번호가 일치하지 않음
                if (result === null) {
                    message = 'Does not match id or password.';

                    res.status(400).send({ message });
                // access token과 refresh token 생성
                } else {
                    const user_uuid = result.uuid;

                    message = 'Success!';
                    data = generate(user_uuid, id);
                    res.status(200).send({ message, data });
                }
            })
        }
    }
}