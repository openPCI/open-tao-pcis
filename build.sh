for i in * ; do
  if [ -d "$i" ] && [ "$i" != "builds" ]; then
    echo "$i"
    cd $i
    zip -r "../builds/$i.zip" .
    cd ..
  fi
done
