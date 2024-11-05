FROM golang:1.23.2 as build

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/reference/dockerfile/#copy
COPY ./cmd/gocker/ ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /gocker

# Optional:
# To bind to a TCP port, runtime parameters must be supplied to the docker command.
# But we can document in the Dockerfile what ports
# the application is going to listen on by default.
# https://docs.docker.com/reference/dockerfile/#expose
FROM alpine:latest
COPY --from=build gocker ./
EXPOSE 3000

# Run
CMD ["/gocker"]