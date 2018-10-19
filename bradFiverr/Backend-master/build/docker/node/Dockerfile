FROM node:7.2-alpine

#RUN apk update 

COPY src            /opt/sharemytech

RUN cd /opt/sharemytech \
    && npm set progress=false \
    && npm install --production \
    && npm cache clear 

WORKDIR /opt/sharemytech

CMD ["node", "index.js"]
