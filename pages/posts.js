import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Row, Col, Card, Avatar, Button as button, Input } from "antd";
import Head from "next/head";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AuthContext } from "../context/auth";
import { LikeOutlined  } from '@ant-design/icons';
const { Meta } = Card;

export const Posts = ({ posts }) => {
  const [auth, setAuth] = useContext(AuthContext);
  // state
  const [allPosts, setAllPosts] = useState(posts);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [Likes, setLikes] = useState("");
  const [postIdd, setpostId] = useState("");
  const [flag, setFlag] = useState(false);
  //Search

  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/post-count");
      console.log("total", data);
      setTotal(data);
    } catch (err) {
      console.log(err);
    }
  };

  const UpdateLike = async (ee) => {
    try {
      // setpostId(ee);
      setLikes("");
      const postId = ee;
      console.log(postId);
      const { data } = await axios.post("/likes", { postId });
      console.log("total", data);

      setLikes(data.likes);
      setFlag(true);
      LikeHelper();
    } catch (err) {
      console.log(err);
    }
  };

  const DisLike = async (ee) => {
    try {
      const postId = ee;
      console.log(postId);
      const { data } = await axios.post("/disLikes", { postId });
      console.log("total", data);
      setLikes(data.likes);
      setFlag(false);
      LikeHelper();
    } catch (err) {
      console.log(err);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/posts/${page}`);
      setAllPosts([...allPosts, ...data]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const LikeHelper = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/posts/${page}`);
      setAllPosts([...data]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const searchItems = (searchValue) => {
    console.log(searchValue);

    setSearchInput(searchValue);
    if (searchInput !== "") {
      const filteredData = allPosts.filter((item) => {
        return item.title.toLowerCase().includes(searchInput.toLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(allPosts);
    }
  };

  const fav = async (ee, pt, pl,ps) => {
    try {
      console.log(allPosts)
      console.log(auth.user.favourites);
      console.log(ps)
 
      const userId = auth.user._id;
      const postId = ee;
      const postTitle = pt;
      const postLikes = pl;
      const postSlug = ps;
      console.log(postId);
      const { data } = await axios.post("/addtofav", {
        postTitle,
        postLikes,
        postId,
        userId,
        postSlug
      });
      console.log("Added To Favorites", data);
      // setLikes(data.likes);
      // setFlag(false)
      // LikeHelper();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>


      <Head>
      <script src="https://kit.fontawesome.com/1c5731001d.js" crossorigin="anonymous"></script>
      
        <title>Recent blog posts</title>
        <meta description="Blog posts about web development, programming etc" />
      </Head>
      <div class="flex-1">
              <div class="relative mt-4 md:mt-0 lg:mt-4">
              <label class="">
            <input  onChange={(e) => searchItems(e.target.value)}  class="rounded-lg p-4 bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 w-full"
              placeholder="Search..." />
          </label>
              </div>
            </div>
  <main class="flex w-full h-full shadow-lg pt-6">


  <section class="flex flex-col w-2/12  bg-white ">
          <div class="w-16 mx-auto mt-12 mb-20 p-4 bg-indigo-600 rounded-2xl text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <nav class="relative flex flex-col py-4 items-center">
            <a href="/posts" class="relative w-16 p-4 bg-purple-100 text-purple-900 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
              </svg>
              <span
                class="absolute -top-2 -right-2 bg-red-600 h-6 w-6 p-2 flex justify-center items-center text-white rounded-full">{allPosts.length}</span>
            </a>
            <a href="/fav" class="w-16 p-4 border text-gray-700 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </a>
            <a href="/contact" class="w-16 p-4 border text-gray-700 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </a>
            <a href="#" class="w-16 p-4 border text-gray-700 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </a>
            <a href="#" class="w-16 p-4 border text-gray-700 rounded-2xl mb-24">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </a>
            <a href="#" class="w-16 p-4 border text-gray-700 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </nav>
        </section>
      {searchInput.length > 1 ? (
        <Row gutter={12}>
          {filteredResults.map((post) => (
            <section class="w-12/12 md:w-6/12 px-4 flex flex-col bg-white">
              {/* <Link href={`/post/${post.slug}`}>
              <a>
                <Card
                  hoverable
                  cover={
                    <Avatar
                      shape="square"
                      style={{ height: "200px" }}
                      src={post.featuredImage?.url || "images/default.jpeg"}
                      alt={post.title}
                    />
                  }
                >
                   <p>{post.likes}</p>                    
                </Card>
              </a>
           </Link> */}
          
              <div class="flex justify-center">
                <div class="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg">
                <Link href={`/post/${post.slug}`}>
                  <img
                    class=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
                    src={post.featuredImage?.url || "images/default.jpeg"}
                    alt=""
                  />
                  <div class="p-6 flex flex-col justify-start">
                    <h5 class="text-gray-900 text-xl font-medium mb-2">
                      {post.title}
                    </h5>
                    <p class="text-gray-700 text-base mb-4">{post.content}</p>
                    <p class="text-gray-700 text-base mb-4">{post.likes}</p>
                    <p class="text-gray-600 text-xs">Last updated 3 mins ago</p>
                   
                  </div>
                  </Link>
                  
                </div>
                
              </div>




              {/* {!flag ? (<button onClick={()=> UpdateLike(post._id)}>Likes</button>):(<button onClick={()=> DisLike(post._id)}>DisLikes</button>)} */}
              {/* {flag &&  <button onClick={()=> UpdateLike(post._id)}>Likes</button>}
        {!flag && <button onClick={()=> DisLike(post._id)}>DisLikes</button>} */}
              <CopyToClipboard
                text={"http://localhost:3000/post/" + post.slug}
              >
                <button>Copy URL to the clipboard</button>
              </CopyToClipboard>
              {/* <button onClick={Dislike}>Dislikes</button> */}
            </section>
          ))}
        </Row>
      ) : (
        <Row gutter={12}>
          {allPosts.map((post) => (
            <section class="w-12/12 md:w-6/12 px-4 flex flex-col bg-white">
              {/* <Link href={`/post/${post.slug}`}>
              <a>
                <Card
                  hoverable
                  cover={
                    <Avatar
                      shape="square"
                      style={{ height: "200px" }}
                      src={post.featuredImage?.url || "images/default.jpeg"}
                      alt={post.title}
                    />
                  }
                >
                   <p>{post.likes}</p>                    
                </Card>
              </a>
           </Link> */}
           <Link href={`/post/${post.slug}`}>
              <div class="flex justify-center">
                <div class="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg">
                  <img
                    class=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
                    src={post.featuredImage?.url || "images/default.jpeg"}
                    alt=""
                  />
                  <div class="p-6 flex flex-col justify-start">
                    <h5 class="text-gray-900 text-xl font-medium mb-2">
                      {post.title}
                    </h5>
                    <p class="text-gray-700 text-base mb-4">{post.content}</p>
                    <p class="text-gray-700 text-base mb-4">{post.likes}</p>
                    <p class="text-gray-600 text-xs">Last updated 3 mins ago</p>
                  
                  </div>
                </div>
              </div>

</Link>
 <div className="flex pl-36 ">
                    <button onClick={() => UpdateLike(post._id)} class=" m-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded inline-flex items-center">
                    <i class="fa-solid fa-thumbs-up"></i>
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            
                      <span>Like</span>
                    </button>
                    <button  onClick={() => DisLike(post._id)} class="m-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded inline-flex items-center">
                      <svg
                        class="fill-current w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                      </svg>
                      <span>Dislike</span>
                    </button>
                    {auth && (
                <button onClick={() => fav(post._id, post.title, post.likes,post.slug)}>
                  Add to Fav
                </button>
              )}
                    </div>
              {/* {!flag ? (<button onClick={()=> UpdateLike(post._id)}>Likes</button>):(<button onClick={()=> DisLike(post._id)}>DisLikes</button>)} */}
              {/* {flag &&  <button onClick={()=> UpdateLike(post._id)}>Likes</button>}
        {!flag && <button onClick={()=> DisLike(post._id)}>DisLikes</button>} */}
              <CopyToClipboard
                text={"http://localhost:3000/post/" + post.slug}
              >
                <button>Copy URL to the clipboard</button>
              </CopyToClipboard>
              {/* <button onClick={Dislike}>Dislikes</button> */}
            </section>
          ))}
        </Row>
      )}
</main>
      {allPosts?.length < total && (
        <Row>
          <Col span={24} style={{ textAlign: "center", padding: 20 }}>
            <button
              size="large"
              type="primary"
              loading={loading}
              onClick={() => setPage(page + 1)}
            >
              Load More
            </button>
          </Col>
        </Row>
      )}
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/posts/1`);
  return {
    props: {
      posts: data,
    },
  };
}

export default Posts;
