global.__root = __dirname;

global.__config = {
    frontendURL: 'https://sharemy.tech/',

    mongo: {
        url: "mongodb://localhost:27017/admin",
        user: "adminsmt",
        password: "adminsmt2016"
    },

    // redisUrl: 'redis://redis:6379/',
    redisUrl: 'redis://localhost:6379/',

    port: 81,

    aws: {
        accessKeyID: "AKIAIU6FFGJHRLFBD5HA",
        secretAccessKey: "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",
        s3Region: "eu-west-1"
    },

    mandrill: {
        apikey: "vqvIEUDohKqq5X6QuAF-Lg",
        from_email: "contact@sharemy.tech",
        from_name: "ShareMy",
        contact_mail: "contact@sharemy.tech"
    },

    stripe_key: "sk_test_lgIHjMruupDptvG91PlyMnne", //old

    stripe: {
        // client_id: "ca_AB0EAkJcjCz4jyczx2sbeCYnG4mKhiza", //shareMy dev
        client_id: "ca_AB0ESnpbT6WmMpSjgMzHCfUTSI2r92zw", //shareMy prod

        // client_secret: "sk_test_lgIHjMruupDptvG91PlyMnne", //shareMy dev
        client_secret: "sk_live_v7zQfH7knL70Zjwa6Mwt4BMl", //shareMy prod

        access_token_endpoint: "https://connect.stripe.com/oauth/token",
        api_endpoint: "https://connect.stripe.com/oauth/"
    },

    salt1: "hhy7887**UHYJR^%$$%#%RFGvjhiyn89u(*UNJbkjg678p(PO:J",

    defaultRadius: 20
};