import { useQuery } from '@tanstack/react-query';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import app from '../firebase';

const fetchBlogPreviews = async () => {
  const db = getFirestore(app);
  const storage = getStorage(app);

  // Query the 3 newest blogs ordered by date descending
  const blogsQuery = query(
    collection(db, 'blogs'),
    orderBy('date', 'desc'),
    limit(3)
  );

  const querySnapshot = await getDocs(blogsQuery);
  const blogs = [];

  for (const docSnap of querySnapshot.docs) {
    const blogData = docSnap.data();

    // Get download URL for image if it exists
    let imageUrl = '/images/placeholder.jpg'; // Default placeholder
    if (blogData.image && typeof blogData.image === 'string') {
      try {
        const imageRef = ref(storage, blogData.image);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.warn(`Failed to load image for blog ${docSnap.id}:`, error);
        // Keep default placeholder
      }
    }

    // Format date from Firestore Timestamp to match legacy format
    let formattedDate = '';
    if (blogData.date && blogData.date.toDate) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      formattedDate = blogData.date
        .toDate()
        .toLocaleDateString('hr-HR', options);
    }

    blogs.push({
      id: docSnap.id,
      title: blogData.title || '',
      description: blogData.description || '',
      date: formattedDate,
      imageUrl: imageUrl
    });
  }

  return blogs;
};

export const useBlogPreviews = () => {
  return useQuery({
    queryKey: ['blogPreviews', 'limit-3'],
    queryFn: fetchBlogPreviews,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};