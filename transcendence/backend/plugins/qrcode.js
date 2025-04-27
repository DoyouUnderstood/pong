import speakeasy from 'speakeasy'

export default function qrcodeServiceFactory()
{
    return {
        generateSecret()
        {
            const secret = speakeasy.generateSecret({length: 20});
            return secret;
        },
    };
}
