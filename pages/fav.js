import { useState, useEffect,useContext } from "react";
import axios from "axios";
import { Row, Col, Card, Avatar, Button, Input } from "antd";
import Head from "next/head";
import Link from "next/link";
import { AuthContext } from "../context/auth";
const { Meta } = Card;

export const Posts = ({ posts }) => {

  const [auth, setAuth] = useContext(AuthContext);
  // state
  const [allPosts, setAllPosts] = useState(posts);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const[Likes,setLikes]=useState("");
  const[postIdd,setpostId]=useState("");
  const[Favorites,setFavorites]=useState([]);
  const[flag,setFlag]=useState(false);
//Search

const [filteredResults, setFilteredResults] = useState([]);
const [searchInput, setSearchInput] = useState('');



  useEffect(() => {
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getTotal = async () => {
    try {
        console.log("Helloi")
        console.log(auth)
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
       const postId=ee;
     console.log(postId)
      const { data } = await axios.post("/likes",{postId});
      console.log("total", data);
      
      setLikes(data.likes);
      setFlag(true)
      LikeHelper();
      
      
      
    } catch (err) {
      console.log(err);
    }
  };

  const DisLike = async (ee) => {
    try {
      const postId=ee;
     console.log(postId)
      const { data } = await axios.post("/disLikes",{postId});
      console.log("total", data);
      setLikes(data.likes);
      setFlag(false)
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
 
    setSearchInput(searchValue)
    if (searchInput !== '') {
        const filteredData = allPosts.filter((item) => {
            return item.title.toLowerCase().includes(searchInput.toLowerCase())
        })
        setFilteredResults(filteredData)
    }
    else{
        setFilteredResults(allPosts)
    }
}

const fav = async (ee,pt,pl,) => {
  try {
  console.log(auth.user._id)
    const userId=auth.user._id
    const postId=ee;
    const postTitle=pt;
    const postLikes=pl;
   console.log(postId)
    const { data } = await axios.post("/addtofav",{postTitle,postLikes,postId,userId});
    console.log("Added To Favorites", data);
    // setLikes(data.likes);
    // setFlag(false)
    // LikeHelper();
   
  } catch (err) {
    console.log(err);
  }
};

const loadData = async () =>{
    try {
        console.log(auth.user.favourites)

        setFavorites(auth.user.favourites);
        LikeHelper();

        // const userId=auth.user._id
      
        // const { data } = await axios.post("/getAllFav",{userId});
        // console.log("SA")

        // for(const ele of data){
        //     console.log(ele.favourites.postId)
        // }
       // console.log(data.favourites)
      

        return;
        // data.forEach(element => {
        //     console.log(element.title)
        // });
        
        setFavorites(data);
        
    } catch (error) {
    console.log(error)       
    }
}

useEffect(() => {
    loadData();
  }, []);



  return (
    <>
      <Head>
        <title>Recent blog posts</title>
        <meta description="Blog posts about web development, programming etc" />
      </Head>
      <Input 
                placeholder='Search...'
                onChange={(e) => searchItems(e.target.value)}
            />
<button onClick={()=> loadData()}>DisLikes</button>
<main class="flex w-full h-full shadow-lg ">
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
{searchInput.length>1 ? ( <Row gutter={12}>
        {filteredResults.map((post) => (
          <section class="w-12/12 md:w-6/12 px-4 flex flex-col bg-white">
            <Link href={`/post/${post.slug}`}>
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
                    {/* if(page==1){
                      <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                    }
                    else{
                      <button onClick={()=> DisLike(post._id)}>DisLikes</button>
                    } */}
                     
                </Card>
              </a>
        </Link>

        {/* {!flag ? (<button onClick={()=> UpdateLike(post._id)}>Likes</button>):(<button onClick={()=> DisLike(post._id)}>DisLikes</button>)} */}
        {/* {flag &&  <button onClick={()=> UpdateLike(post._id)}>Likes</button>}
        {!flag && <button onClick={()=> DisLike(post._id)}>DisLikes</button>} */}
        <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                     <button onClick={()=> DisLike(post._id)}>DisLikes</button>
        

        {user && <button onClick={fav(post._id)}>Add to Fav</button> }
                    
                  <Meta title={post.title} />
          </section>
        ))}
      </Row>):( <Row gutter={12}>
        {Favorites.map((post) => (
          <section class="w-12/12 md:w-6/12 px-4 flex flex-col bg-white">
            <Link href={`/post/${post.slug}`}>
              <a>
              <Meta title={post.title} />
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
                    {/* if(page==1){
                      <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                    }
                    else{
                      <button onClick={()=> DisLike(post._id)}>DisLikes</button>
                    } */}
                     
                </Card>
              </a>
        </Link>

        {/* {!flag ? (<button onClick={()=> UpdateLike(post._id)}>Likes</button>):(<button onClick={()=> DisLike(post._id)}>DisLikes</button>)} */}
        {/* {flag &&  <button onClick={()=> UpdateLike(post._id)}>Likes</button>}
        {!flag && <button onClick={()=> DisLike(post._id)}>DisLikes</button>} */}
        <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                     <button onClick={()=> DisLike(post._id)}>DisLikes</button>
                     {auth && <button onClick={()=>fav(post._id,post.title,post.likes)}>Add to Fav</button> }
                     {/* <button onClick={Dislike}>Dislikes</button> */}
                 
          </section>
        ))}
      </Row>)}
     
</main>
      {allPosts?.length < total && (
        <Row>
          <Col span={24} style={{ textAlign: "center", padding: 20 }}>
            <Button
              size="large"
              type="primary"
              loading={loading}
              onClick={() => setPage(page + 1)}
            >
              Load More
            </Button>
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