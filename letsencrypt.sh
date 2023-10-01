#   Command that worked to create ssl
  #   docker run -it --rm \
  # -v ./certs:/etc/letsencrypt \
  # -v ./certs-data:/data/letsencrypt \
  # -v /tmp/acme_challenge:/tmp/acme_challenge \
  # certbot/certbot certonly --webroot \
  # --email reillymclaren20@gmail.com \
  # --agree-tos \
  # --webroot-path=/tmp/acme_challenge \
  # -d backend.ruchimaniar.com