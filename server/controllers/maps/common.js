const { v4 } = require('uuid');
const { user } = require('../../models');
const { generate, hash, refresh } = require('../../utils/token');

/**
 * @path /map
 */
module.exports = {
    /**
     * 내 위치 조회 API
     * @method GET
     * @param { authorization } req.headers
     */
    get: (req, res) => {
        const hashData = hash(req.headers);
        let message = '';
        let data = {};

        // 회원정보 조회
        if (hashData.uuid !== undefined) {
            const { uuid, user_id } = hashData;

            // 내 위치 조회
            user.findOne({
                where: {
                    uuid,
                    user_id
                },
                attributes: [
                    'latitude',
                    'longitude'
                ]
            }).then(result => {
                if (result === null) {
                    message = 'Check your access token.';
        
                    res.status(401).send({ message });
                } else {
                    message = 'Success!';
                    data.latitude = result.dataValues.latitude;
                    data.longitude = result.dataValues.longitude;

                    res.status(200).send({ message, data });
                }
            });
        // 액세스 토큰 만료 처리
        } else if (hashData) {
            message = 'The access token has expired.';

            res.status(401).send({ message });
        // 액세스 토큰이 잘못됨
        } else {
            message = 'Check your access token.';

            res.status(401).send({ message });
        }
    },
    put: (req, res) => {
    }
}