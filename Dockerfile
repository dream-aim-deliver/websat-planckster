FROM almalinux:9

LABEL stage=production

RUN dnf -y update && \
    dnf -y module reset nodejs && \
    dnf -y module enable nodejs:20 && \
    dnf -y module install nodejs:20/common && \
    dnf -y install httpd mod_ssl python39 python-pip git procps patchutils vim && \
    dnf clean all && \
    rm -rf /var/cache/dnf

RUN python3 -m pip install --no-cache-dir --upgrade pip && \
    python3 -m pip install --no-cache-dir --upgrade setuptools
RUN python3 -m pip install --no-cache-dir j2cli

RUN rm -rf /etc/httpd/conf.d/ssl.conf

ENV NVM_DIR /home/sda/.nvm
RUN mkdir -p $NVM_DIR
ENV NODE_VERSION 20.4.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

RUN npm i -g pm2

WORKDIR /opt/dadai/app
COPY dist/docker-entrypoint.sh /
COPY . /opt/dadai/app

ENV APP_PATH=/opt/dadai/app

RUN npm install

EXPOSE 443
EXPOSE 80

ENTRYPOINT ["dist/docker-entrypoint.sh"]