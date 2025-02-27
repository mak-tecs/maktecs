import MyRating from "@/app/components/MyRating";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";


export default async function RatingReview({ product }) {
    // const [counts, setCounts] = useState(null);
    const counts = await getProductReviewCounts({ productId: product?.id });
  
    // useEffect(() => {
    //   const fetchReviewCounts = async () => {
    //     try {
    //       const data = await getProductReviewCounts({ productId: product?.id });
    //       setCounts(data);
    //     } catch (error) {
    //       console.error("Error fetching product review counts:", error);
    //     }
    //   };
  
    //   fetchReviewCounts();
    // }, [product?.id]);
  
    return (
      <div className="flex gap-3 items-center">
        <MyRating value={counts?.averageRating ?? 0} />
        <h1 className="text-sm text-gray-400">
          <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews}
          )
        </h1>
      </div>
    );
  }