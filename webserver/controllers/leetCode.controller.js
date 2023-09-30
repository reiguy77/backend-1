exports.getLeetCodeData = async (req, res) => {
    let username = req.body.username;
    if(!username){
        res.status(400).send({ message: "Username can not be empty!" });
        return;
    }
    
    const query = `query getUserProfile($username: String!) {
            matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
                acSubmissionNum {
                difficulty
                count
                submissions
                }
            }
            }
        }
        `;

    const variables = {
    username: username,
    };

    const requestBody = {
        query,
        variables
    };

    console.log(requestBody);

          fetch('https://leetcode.com/graphql', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any additional headers if required
            },
            body: JSON.stringify(requestBody),
          })
            .then((resp) => {
              return resp.json();
            })
            .then((data) => {
              console.log(data);
              res.send({
                data: data.data,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({
                message: err.message || "Some error occurred while fetching LeetCode data",
              });
            });
        };
        