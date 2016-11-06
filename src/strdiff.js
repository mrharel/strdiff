

function increaseIndex(index,len){
  if( index < len ){
    return index+1;
  }
  return index;
}

function addToMap(ch, obj, index){
  if( !ch || !obj ) return;
  if( typeof obj[ch] !== 'string' ){
    obj[ch] = index;
  }
}

function addAction(actions, str, type = "no-chage"){
  actions.push({
    value: str,
    added: type === 'add',
    removed: type === 'delete'
  });
}

export function strDiff(source, target){
  var indexSource = 0;
  var indexTarget = 0;
  const lenSource = source.length;
  const lenTarget = target.length;

  var actions = [];
  var mapSource = {};
  var mapTarget = {};
  var lastSource = null;
  var lastTarget = null;
  var match = true;
  var mismatchSourceIndex = -1;
  var mismatchTargetIndex = -1;
  var noChangeBuffer = '';



  var A = source;
  var B = target;

  source = source.split("");
  target = target.split("");

  var s = source[0];
  var t = target[0];
  while( indexSource < lenSource && indexTarget < lenTarget ){
    s = source[indexSource];
    t = target[indexTarget];

    //if both are the same and we are still in a match sequance, so by all means, keep going.
    if( s === t && match ){
      indexSource = increaseIndex(indexSource,lenSource);
      indexTarget = increaseIndex(indexTarget,lenTarget);
      noChangeBuffer += s;
      continue;
    }

    if(  s !== t && match ){
      //this is the first mismatch in the sequance.
      match = false;
      addToMap(s,mapSource,indexSource);
      addToMap(t,mapTarget,indexTarget);
      mismatchTargetIndex = indexTarget;
      mismatchSourceIndex = indexSource;
      indexSource = increaseIndex(indexSource,lenSource);
      indexTarget = increaseIndex(indexTarget,lenTarget);
      if(noChangeBuffer.length ){
        addAction(actions,noChangeBuffer);
        noChangeBuffer = '';
      }
      continue;
    }

    if( !match ){

      //first we compare the target to the source map
      if( typeof mapSource[t] === 'number' ){
        //we need to add all the strings from

        //checking to see if we have something to delete
        if( mapSource[t] > mismatchSourceIndex ){
          addAction(actions,A.substring(mismatchSourceIndex,mapSource[t]),"delete")
        }
        addAction(actions,B.substring(mismatchTargetIndex,indexTarget),"add");
        match = true;
        noChangeBuffer += t;
        indexSource = mapSource[t]+1;
        indexTarget = increaseIndex(indexTarget,lenTarget);
        mismatchSourceIndex = -1;
        mismatchTargetIndex = -1;
        mapSource = {};
        mapTarget = {};
        continue;
      }

      if( typeof mapTarget[s] === 'number' ){
        addAction(actions,A.substring(mismatchSourceIndex,indexSource),"delete");
        if( mapTarget[s] > mismatchTargetIndex ){
          addAction(actions,B.substring(mismatchTargetIndex,mapTarget[s]),"add");
        }

        match = true;
        indexTarget = mapTarget[s]+1
        indexSource = increaseIndex(indexSource, lenSource);
        noChangeBuffer += s;
        mismatchSourceIndex = -1;
        mismatchTargetIndex = -1;
        mapSource = {};
        mapTarget = {};
        continue;
      }

      if( s === t ){
        addAction(actions,B.substring(mismatchTargetIndex,indexTarget),"add");
        addAction(actions,A.substring(mismatchSourceIndex,indexSource),"delete");
        match = true;
        noChangeBuffer += t;
        indexTarget = increaseIndex(indexTarget, lenTarget);
        indexSource = increaseIndex(indexSource, lenSource);
        mapSource = {};
        mapTarget = {};
        mismatchSourceIndex = -1;
        mismatchTargetIndex = -1;
        continue;
      }

      //trying to see if we can more forward
      //but we only want to add new stuff
      addToMap(s,mapSource,indexSource);
      addToMap(t,mapTarget,indexTarget);

      var lastIndexSource = indexSource;
      var lastIndexTarget = indexTarget;
      if( s !== source[indexSource+1]  ){
        indexSource = increaseIndex(indexSource, lenSource);
      }

      if( t !== target[indexTarget+1] ){
        indexTarget = increaseIndex(indexTarget, lenTarget);
      }

      if( lastIndexSource === indexSource && lastIndexTarget === indexTarget ){
        addAction(actions,B.substring(mismatchTargetIndex,indexTarget),"add");
        addAction(actions,mismatchSourceIndex,A.substring(mismatchSourceIndex,indexSource),"delete");
        match = true;
        indexTarget = mismatchTargetIndex+1;
        indexSource = mismatchSourceIndex+1;
        mapSource = {};
        mapTarget = {};
        mismatchSourceIndex = -1;
        mismatchTargetIndex = -1;
        continue;
      }
    }
  }


  if(noChangeBuffer.length ){
    addAction(actions,noChangeBuffer);
    noChangeBuffer = '';
  }


  if( indexTarget < lenTarget ){
    if( mismatchSourceIndex === -1 ){
      addAction(actions,B.substring(indexTarget),"add");
    }
    else{
      addAction(actions,A.substring(mismatchSourceIndex),"delete");
      addAction(actions,B.substring(mismatchTargetIndex),"add");
    }
  }

  if( indexSource < lenSource  ){
    //we delete all the rest of the source
    if( mismatchSourceIndex === -1 ){
      addAction(actions,A.substring(indexSource),"delete");
    }
    else{
      addAction(actions,A.substring(mismatchSourceIndex),"delete");
      addAction(actions,B.substring(mismatchTargetIndex),"add");
    }
  }

  if( indexTarget === lenTarget && indexSource === lenSource && mismatchSourceIndex !== -1 ){
    //in this case we got to the end in the same indexes and we still have a mismatch
    addAction(actions,A.substring(mismatchSourceIndex),"delete");
    addAction(actions,B.substring(mismatchTargetIndex),"add");
  }
  return actions;
}
