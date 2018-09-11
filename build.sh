for i in * ; do
  if [ -d "$i" ] && [ "$i" != "builds" ]; then
    echo "$i"
    cd $i
    zip -r ../builds/brainstorm.zip .
    cd ..
  fi
done
