for i in * ; do
  if [ -d "$i" ]; then
    echo "$i"
    cd $i
    zip -r ../builds/brainstorm.zip .
    cd ..
  fi
done
