package {
public class XML {

  public function XML() {

    var sport:XML =
      <sport>
        <name isCool='yes'>Basketball</name>
        <players>men</players>
        <players>women</players>
        <nationalTV>NBC</nationalTV>
        <nationalTV>ESPN</nationalTV>
      </sport>;

    sport.name.@isCool = '→';

    var some_numbers:Vector.<Number> = new Vector.<Number>();
    some_numbers.push(0);
    trace('sport name isCool: ' + sport.name.attributes[some_numbers[0]]);
    trace('sport name isCool: ' + sport.name.attributes['isCool']);
    trace('sport name isCool: ' + sport.name.@isCool);
  }
}
}
