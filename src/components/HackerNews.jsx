import React, { useState, useEffect } from "react";
import axios from "axios";
import calendarIcon from "../icons8-calendar-24.png";
import starGoldIcon from "../star-icon-gold.png";
import Author from "./Author";
import "../index.scss";
import classes from "./HackerNews.module.scss";

function HackerNews() {
  const [randomHackerNewsStories, setRandomHackerNewsStories] = useState([]);
  const [imagesAssets, setImagesAssets] = useState([]);

  const fetchHackerNewsStoriesIds = async () => {
    const { data } = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    return data;
  };

  const fetchHackerNewsStory = async (id, idx) => {
    const { data } = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );

    return data;
  };

  const getHackerNewsStories = async () => {
    const hackerNewsStoriesIds = await fetchHackerNewsStoriesIds();

    const hackerNewsStories = await Promise.all(
      hackerNewsStoriesIds
        .sort(() => Math.random() - Math.random()) //randomize array
        .slice(0, 10) //get only 10 items;
        .map((id, idx) => fetchHackerNewsStory(id, idx))
    );
    console.log(hackerNewsStories);
    setRandomHackerNewsStories(sortNewsStories(hackerNewsStories));
  };

  const sortNewsStories = (hackerNewsStories) => {
    return hackerNewsStories.sort((a, b) => a.score - b.score);
  };

  const importAllImages = (r) => {
    let images = {};
    r.keys().forEach((item, index) => {
      images[item.replace("./", "")] = r(item);
    });

    setImagesAssets(images);
  };

  useEffect(() => {
    importAllImages(
      require.context("../assets/images", false, /\.(png|jpe?g|svg)$/)
    );

    getHackerNewsStories();
  }, []);

  return (
    <>
      <div className="container">
        <h1>Hacker news</h1>
        <div className="row">
          {randomHackerNewsStories.map((news, idx) => (
            <div key={news.id} className="col">
              <div className={classes.news}>
                <span className={classes.news__score}>
                  <img
                    src={starGoldIcon}
                    alt=""
                    height={12}
                    className="mn-r-5"
                  />
                  {news.score}
                </span>
                {news.url ? (
                  <h3>
                    <a href={news.url} target="_blank" rel="noreferrer">
                      <img
                        className={classes.news__img}
                        src={imagesAssets[`${idx}.jpg`]}
                        alt=""
                        height={200}
                      />
                      <span className={classes.news__title}>{news.title}</span>
                    </a>
                  </h3>
                ) : (
                  <h3>
                    <a href={news.url} target="_blank" rel="noreferrer">
                      <img
                        className={classes.news__img}
                        src={imagesAssets[`${idx}.jpg`]}
                        alt=""
                        height={200}
                      />
                      <span className={classes.news__title}>{news.title}</span>
                    </a>
                  </h3>
                )}
                <div className={classes.news__footer}>
                  <div className={classes.news__footer__timestamp}>
                    <img src={calendarIcon} alt="" height={13} />
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(news.time)}
                  </div>
                  <Author id={news.by} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HackerNews;
