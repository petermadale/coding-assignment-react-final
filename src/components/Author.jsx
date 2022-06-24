import React, { useEffect, useState } from "react";
import axios from "axios";
import authorIcon from "../icons8-user-50.png";
import starGoldIcon from "../star-icon-gold.png";
import classes from "./Author.module.scss";

function Author({ id }) {
  const [author, setAuthor] = useState();
  const fetchAuthorDetails = async (id) => {
    const { data } = await axios.get(
      `https://hacker-news.firebaseio.com/v0/user/${id}.json`
    );
    setAuthor(data);
  };

  useEffect(() => {
    fetchAuthorDetails(id);
  }, [id]);

  return (
    <>
      {author !== undefined ? (
        <div className={classes.author}>
          <img src={authorIcon} alt="" height={13} />
          By: {author.id}
          <span className={classes.author__title}>
            <img src={starGoldIcon} alt="" height={12} className="mn-r-5" />
            {author.karma.toLocaleString()}
          </span>
        </div>
      ) : null}
    </>
  );
}

export default Author;
