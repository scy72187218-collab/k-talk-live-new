module.exports = async function handler(req,res){
  if(req.method!=='GET'){
    res.statusCode=405;
    res.setHeader('Allow','GET');
    return res.end('Method Not Allowed');
  }

  const rows=[
    {"id":"8e1eac73-f54f-4023-93cc-daca7294bd6f","author_name":"K-Talk","title":"4a71d443-4b27-409a-bcce-da3723c44a12-1_all_16890.mp4","video_url":"https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1789742631992-yen8is.mp4","created_at":"2026-09-18T14:44:17.716584+00:00","likes":0},
    {"id":"839c441d-1d3a-4941-872b-f43a77bf8245","author_name":"태권1","title":"14402.mp4","video_url":"https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1789858184221-0lyob9.mp4","created_at":"2026-09-19T22:49:45.508379+00:00","likes":0},
    {"id":"69dfec54-90b0-4920-8612-b25f13f023d9","author_name":"K-Talk","title":"14254.mp4","video_url":"https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4","created_at":"2026-09-04T10:11:42.32304+00:00","likes":0},
    {"id":"208b4b2b-6103-47ee-8b28-e68205b5a309","author_name":"K-Talk","title":"14402.mp4","video_url":"https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516656323-4elqcf.mp4","created_at":"2026-09-04T10:10:58.842722+00:00","likes":0},
    {"id":"bfa6e6a9-c430-463c-8ed7-7a8014b5d922","author_name":"K-Talk","title":"14407.mp4","video_url":"https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516618159-4ep5ki.mp4","created_at":"2026-09-04T10:10:21.376032+00:00","likes":0},
    {"id":"a4b8207a-59f8-405c-851d-3427d67ba02d","author_name":"K-Talk","title":"aa3ad43f-1526-4358-8bd1-e9bad68c133a-1_all_9860.mp4","video_url":"https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788507442298-joc6va.mp4","created_at":"2026-09-04T07:37:24.18549+00:00","likes":0},
    {"id":"380f3436-fb7e-45d8-8672-c575af5e93b2","author_name":"K-Talk","title":"15570.mp4","video_url":"https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788482162994-oefkvu.mp4","created_at":"2026-09-04T00:36:04.735908+00:00","likes":0}
  ];

  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=30, s-maxage=300, stale-while-revalidate=86400');
  res.statusCode=200;
  return res.end(JSON.stringify(rows));
};