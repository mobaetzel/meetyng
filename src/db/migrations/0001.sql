CREATE TABLE groups
(
    key         UUID PRIMARY KEY,

    admin_key   UUID        NOT NULL,
    admin_name  VARCHAR(64) NOT NULL,
    admin_mail  VARCHAR(64) NOT NULL,

    title       VARCHAR(64) NOT NULL,
    location    VARCHAR(64) NOT NULL,
    description TEXT        NOT NULL,

    created     TIMESTAMP   NOT NULL,
    updated     TIMESTAMP   NOT NULL
);

CREATE TABLE options
(
    key       UUID PRIMARY KEY,
    group_key UUID REFERENCES groups (key) ON DELETE CASCADE NOT NULL,
    date      DATE                                           NOT NULL,

    UNIQUE (group_key, date)
);

CREATE TABLE votes
(
    group_key  UUID REFERENCES groups (key) ON DELETE CASCADE  NOT NULL,
    option_key UUID REFERENCES options (key) ON DELETE CASCADE NOT NULL,

    voter_name VARCHAR(64)                                     NOT NULL,

    value      SMALLINT                                        NOT NULL,

    created    TIMESTAMP                                       NOT NULL,

    UNIQUE (group_key, option_key, voter_name)
);

CREATE TABLE comments
(
    key         UUID PRIMARY KEY,
    group_key   UUID REFERENCES groups (key) ON DELETE CASCADE NOT NULL,

    author_name VARCHAR(64)                                    NOT NULL,

    comment     TEXT                                           NOT NULL,

    created     TIMESTAMP                                      NOT NULL
);