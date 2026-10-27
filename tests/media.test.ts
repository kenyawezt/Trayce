import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePhoto} from '../src/media.ts';

test('legacy demo photos use the matching food photograph and stay labelled demo',()=>{
  const photo=resolvePhoto('/demo-weight.svg','Nasi putih');
  assert.equal(photo.src,'/images/rice.webp');
  assert.equal(photo.isDemo,true);
  assert.equal(photo.unavailable,false);
});
test('failed user evidence is explicitly unavailable when showing a demo replacement',()=>{
  const photo=resolvePhoto('/missing-upload.jpg','Ayam goreng',true);
  assert.equal(photo.src,'/images/chicken.webp');
  assert.equal(photo.isDemo,true);
  assert.equal(photo.unavailable,true);
});
test('working user photos are preserved as evidence',()=>{
  const src='data:image/jpeg;base64,valid-user-photo';
  assert.deepEqual(resolvePhoto(src,'Nasi putih'),{src,isDemo:false,unavailable:false});
});
